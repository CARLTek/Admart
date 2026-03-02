from django.db import models
from django.conf import settings
from proposals.models import Proposal
from billboards.models import Billboard


class Bid(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('WITHDRAWN', 'Withdrawn'),
        ('EXPIRED', 'Expired'),
    ]
    
    proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name='bids'
    )
    
    bidder = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bids'
    )
    
    billboard = models.ForeignKey(
        Billboard,
        on_delete=models.CASCADE,
        related_name='bids',
        help_text="The billboard being offered for this proposal"
    )
    
    # Bid details
    proposed_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Your price for this campaign")
    message = models.TextField(help_text="Message to the customer explaining your proposal")
    
    # Duration/terms
    proposed_start_date = models.DateField(help_text="Proposed campaign start date")
    proposed_end_date = models.DateField(help_text="Proposed campaign end date")
    
    # Additional terms
    includes_design = models.BooleanField(default=False, help_text="Include ad design service")
    includes_installation = models.BooleanField(default=True, help_text="Include ad installation")
    additional_notes = models.TextField(blank=True, help_text="Any additional terms or notes")
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    is_accepted = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['proposal', 'bidder']
    
    def __str__(self):
        return f"Bid by {self.bidder.username} on {self.proposal.title}"


class BidMessage(models.Model):
    bid = models.ForeignKey(
        Bid,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bid_messages'
    )
    
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message on bid {self.bid.id} by {self.sender.username}"
