import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// A label + value row used in fine-details and confirmation screens.
class DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;
  final bool monospace;
  final bool large;

  const DetailRow(
    this.label,
    this.value, {
    super.key,
    this.valueColor,
    this.monospace = false,
    this.large = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: const TextStyle(
                color: AppColors.gray500,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontSize: large ? 15 : 14,
                fontWeight: large ? FontWeight.w700 : FontWeight.w600,
                color: valueColor ?? AppColors.ink,
                fontFamily: monospace ? 'monospace' : null,
                letterSpacing: large ? -0.2 : null,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
