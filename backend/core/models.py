from django.db import models

# Create your models here.

SERVICE_CHOICES = (
    ('Flooring Installation', 'Flooring Installation'),
    ('Roof Repair', 'Roof Repair'),
    ('Interior Renovation', 'Interior Renovation'),
    ('Exterior Painting', 'Exterior Painting'),
    ('Plumbing Installation', 'Plumbing Installation'),
    ('Electrical Rewiring', 'Electrical Rewiring'),
    ('Landscaping Design', 'Landscaping Design'),
    ('Kitchen Remodeling', 'Kitchen Remodeling'),
)

class Customer(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()

    def __str__(self):
        return self.name

class Service(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name = "service_orders")
    service_type = models.CharField(max_length=100, choices=SERVICE_CHOICES)
    project_description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    order_date = models.DateTimeField(auto_now_add=True)
    expected_completion_date = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)
    is_completed = models.BooleanField(default=False,null=True,blank=True)  

    def __str__(self):
        return f"{self.customer.name} -{self.service_type}"
    
