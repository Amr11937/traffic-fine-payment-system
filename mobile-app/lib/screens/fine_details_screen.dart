import 'package:flutter/material.dart';
import '../models/fine.dart';
import '../services/api_service.dart';
import 'confirmation_screen.dart';

class FineDetailsScreen extends StatefulWidget {
  final Fine fine;
  const FineDetailsScreen({super.key, required this.fine});

  @override
  State<FineDetailsScreen> createState() => _FineDetailsScreenState();
}

class _FineDetailsScreenState extends State<FineDetailsScreen> {
  final _apiService = ApiService();
  String _paymentMethod = 'CARD';
  bool _loading = false;
  String? _error;

  static String _formatDate(String iso) {
    try {
      final d = DateTime.parse(iso);
      return '${d.day.toString().padLeft(2, '0')}/'
          '${d.month.toString().padLeft(2, '0')}/'
          '${d.year}';
    } catch (_) {
      return iso;
    }
  }

  static String _formatAmount(double amount) {
    return 'LKR ${amount.toStringAsFixed(2).replaceAllMapped(
          RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
          (m) => '${m[1]},',
        )}';
  }

  Future<void> _pay() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final result = await _apiService.processPayment(
        referenceNumber: widget.fine.referenceNumber,
        categoryCode: widget.fine.categoryCode,
        paymentMethod: _paymentMethod,
        amount: widget.fine.amount,
      );
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) =>
              ConfirmationScreen(fine: widget.fine, result: result),
        ),
      );
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final fine = widget.fine;
    return Scaffold(
      appBar: AppBar(title: const Text('Fine Details')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Fine Details',
                            style: Theme.of(context)
                                .textTheme
                                .titleMedium
                                ?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          _StatusChip(isPaid: fine.isPaid),
                        ],
                      ),
                      const Divider(height: 24),
                      _DetailRow('Reference', fine.referenceNumber),
                      _DetailRow('Category', fine.categoryDescription),
                      _DetailRow('Vehicle', fine.vehicleNumber),
                      _DetailRow('Issued', _formatDate(fine.issuedAt)),
                      _DetailRow(
                        'Amount',
                        _formatAmount(fine.amount),
                        valueStyle: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              if (fine.isPaid)
                _InfoBanner(
                  icon: Icons.check_circle_outline,
                  color: const Color(0xFFFEF3C7),
                  borderColor: const Color(0xFFFDE68A),
                  textColor: const Color(0xFF92400E),
                  message:
                      'This fine has already been paid. No further action is required.',
                )
              else ...[
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          'Select Payment Method',
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        AbsorbPointer(
                          absorbing: _loading,
                          child: RadioGroup<String>(
                            groupValue: _paymentMethod,
                            onChanged: (v) =>
                                setState(() => _paymentMethod = v!),
                            child: Column(
                              children: [
                                for (final entry in [
                                  ('CARD', 'Credit / Debit Card'),
                                  ('ONLINE', 'Online Banking'),
                                  ('CASH', 'Cash'),
                                ])
                                  RadioListTile<String>(
                                    title: Text(entry.$2),
                                    value: entry.$1,
                                    contentPadding: EdgeInsets.zero,
                                    dense: true,
                                  ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        if (_loading)
                          const Center(child: CircularProgressIndicator())
                        else
                          FilledButton(
                            onPressed: _pay,
                            style: FilledButton.styleFrom(
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: Text(
                              'Pay ${_formatAmount(fine.amount)}',
                              style: const TextStyle(fontSize: 16),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 16),
                  _InfoBanner(
                    icon: Icons.error_outline,
                    color: const Color(0xFFFEF2F2),
                    borderColor: const Color(0xFFFECACA),
                    textColor: const Color(0xFF991B1B),
                    message: _error!,
                  ),
                ],
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final TextStyle? valueStyle;

  const _DetailRow(this.label, this.value, {this.valueStyle});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: valueStyle ??
                  const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final bool isPaid;
  const _StatusChip({required this.isPaid});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isPaid
            ? const Color(0xFFDCFCE7)
            : const Color(0xFFFEF3C7),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isPaid
              ? const Color(0xFF86EFAC)
              : const Color(0xFFFDE68A),
        ),
      ),
      child: Text(
        isPaid ? 'PAID' : 'UNPAID',
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: isPaid
              ? const Color(0xFF15803D)
              : const Color(0xFF92400E),
        ),
      ),
    );
  }
}

class _InfoBanner extends StatelessWidget {
  final IconData icon;
  final Color color;
  final Color borderColor;
  final Color textColor;
  final String message;

  const _InfoBanner({
    required this.icon,
    required this.color,
    required this.borderColor,
    required this.textColor,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color,
        border: Border.all(color: borderColor),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: textColor, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: TextStyle(color: textColor, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }
}
