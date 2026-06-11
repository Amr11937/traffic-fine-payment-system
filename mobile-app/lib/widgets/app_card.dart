import 'package:flutter/material.dart';

/// White card with soft layered shadow and rounded corners — the design
/// system's primary content container.
class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;

  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0x060F1A2C)),
        boxShadow: const [
          BoxShadow(color: Color(0x0C0F1A2C), blurRadius: 20, offset: Offset(0, 6)),
          BoxShadow(color: Color(0x080F1A2C), blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Padding(padding: padding, child: child),
      ),
    );
  }
}
