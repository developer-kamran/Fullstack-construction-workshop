from django.utils import timezone
from django.db.models import F, ExpressionWrapper, fields

import graphene
from graphene_django import DjangoObjectType
from .models import Customer, Service


class CustomerType(DjangoObjectType):
    class Meta:
        model = Customer
        fields = "__all__"

class ServiceType(DjangoObjectType):
    class Meta:
        model = Service
        fields = "__all__"

    cost = graphene.Float()  # Define cost as an Int

    def resolve_cost(self, info):
        return float(self.cost) 

class ServiceInput(graphene.InputObjectType):
    is_completed = graphene.Boolean()
    cost = graphene.Float()
    expected_completion_date = graphene.Date()


class CreateCustomer(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        address = graphene.String()
        email = graphene.String()
        phone_number = graphene.String()

    customer = graphene.Field(CustomerType)

    def mutate(self, info, name, address, email, phone_number):
        customer = Customer(name=name, address=address, email=email, phone_number=phone_number)
        customer.save()
        return CreateCustomer(customer=customer)


class DeleteCustomer(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        try:
            customer = Customer.objects.get(pk=id)
            customer.delete()
            return DeleteCustomer(success=True)
        except Customer.DoesNotExist:
            return DeleteCustomer(success=False)


class CreateService(graphene.Mutation):
    class Arguments:
        customer = graphene.ID(required=True)  # Define customer as an ID
        service_type = graphene.String()
        cost = graphene.Float()
        project_description = graphene.String()
        expected_completion_date = graphene.Date()

    service = graphene.Field(ServiceType)

    def mutate(self, info, customer, service_type, cost, project_description, expected_completion_date):
        service = Service(
            customer_id=customer, 
            service_type=service_type,
            cost= cost,
            project_description=project_description,
            expected_completion_date=expected_completion_date,
        )
        service.save()
        return CreateService(service=service)


class UpdateService(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ServiceInput()

    service = graphene.Field(ServiceType)

    def mutate(self, info, id, input):
        service = Service.objects.get(pk=id)
        
        if input.is_completed is not None:
            service.is_completed = input.is_completed
        if input.cost is not None:
            service.cost = input.cost
        if input.expected_completion_date:
            service.expected_completion_date = input.expected_completion_date
        
        service.save()
        return UpdateService(service=service)


class DeleteService(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        try:
            service = Service.objects.get(pk=id)
            service.delete()
            return DeleteService(success=True)
        except Service.DoesNotExist:
            return DeleteService(success=False)


class Query(graphene.ObjectType):
    all_customers = graphene.List(CustomerType)
    ordered_services = graphene.List(ServiceType)
    completed_services = graphene.List(ServiceType)
    incompleted_services = graphene.List(ServiceType)
    pending_customers = graphene.List(CustomerType)


    def resolve_all_customers(self, info):
        return Customer.objects.all()

    def resolve_completed_services(self, info):
        return Service.objects.filter(is_completed=True).order_by('-expected_completion_date')[:5]

    def resolve_ordered_services(self, info):

        # Get the current date and time
        current_date = timezone.now().date()

        # Calculate remaining completion days for each service
        services = Service.objects.filter(is_completed=False)

        remaining_days_expression = ExpressionWrapper(
            F('expected_completion_date') - current_date,
            output_field=fields.IntegerField()
        )

        ordered_services = services.annotate(
            remaining_completion_time=remaining_days_expression
        ).order_by('remaining_completion_time')

        return ordered_services

    def resolve_pending_customers(self, info):  
        completed_customer_ids = Service.objects.filter(is_completed=True).values_list('customer', flat=True)
        return Customer.objects.exclude(id__in=completed_customer_ids)


class Mutation(graphene.ObjectType):
    create_customer = CreateCustomer.Field()
    delete_customer = DeleteCustomer.Field()
    create_service = CreateService.Field()
    update_service = UpdateService.Field()
    delete_service = DeleteService.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
