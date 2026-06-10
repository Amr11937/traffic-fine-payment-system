class PaymentResult {
  final String transactionReference;
  final String referenceNumber;
  final String paidAt;

  const PaymentResult({
    required this.transactionReference,
    required this.referenceNumber,
    required this.paidAt,
  });

  factory PaymentResult.fromJson(Map<String, dynamic> json) => PaymentResult(
        transactionReference: json['transactionReference'] as String,
        referenceNumber: json['referenceNumber'] as String,
        paidAt: json['paidAt'] as String,
      );
}
