class Fine {
  final String referenceNumber;
  final String categoryCode;
  final String categoryDescription;
  final double amount;
  final String vehicleNumber;
  final String issuedAt;
  final String status;

  const Fine({
    required this.referenceNumber,
    required this.categoryCode,
    required this.categoryDescription,
    required this.amount,
    required this.vehicleNumber,
    required this.issuedAt,
    required this.status,
  });

  bool get isPaid => status == 'PAID';

  factory Fine.fromJson(Map<String, dynamic> json) => Fine(
        referenceNumber: json['referenceNumber'] as String,
        categoryCode: json['categoryCode'] as String,
        categoryDescription: json['categoryDescription'] as String,
        amount: (json['amount'] as num).toDouble(),
        vehicleNumber: json['vehicleNumber'] as String,
        issuedAt: json['issuedAt'] as String,
        status: json['status'] as String,
      );
}
