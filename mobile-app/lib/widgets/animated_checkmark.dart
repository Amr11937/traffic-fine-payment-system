import 'dart:math';
import 'dart:ui';
import 'package:flutter/material.dart';

/// Draws a circle outline then the checkmark path progressively.
/// Drive [progress] from 0.0 → 1.0 for the full animation.
class AnimatedCheckmark extends StatelessWidget {
  final double progress;
  final double size;

  const AnimatedCheckmark({super.key, required this.progress, this.size = 92});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(painter: _CheckPainter(progress)),
    );
  }
}

class _CheckPainter extends CustomPainter {
  final double progress;
  _CheckPainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final c = Offset(size.width / 2, size.height / 2);
    final r = size.width / 2 - 2;

    // Phase split: 0..0.5 → circle, 0.5..1.0 → checkmark
    final circleP = (progress / 0.5).clamp(0.0, 1.0);
    final checkP  = ((progress - 0.5) / 0.5).clamp(0.0, 1.0);

    // Background fill (grows with circle)
    if (circleP > 0) {
      canvas.drawCircle(
        c, r * circleP,
        Paint()
          ..color = const Color(0xFFECFDF5)
          ..style = PaintingStyle.fill,
      );
      // Circle arc stroke
      canvas.drawArc(
        Rect.fromCircle(center: c, radius: r),
        -pi / 2,
        2 * pi * circleP,
        false,
        Paint()
          ..color = const Color(0xFF047857)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2.8
          ..strokeCap = StrokeCap.round,
      );
    }

    // Checkmark path drawn progressively
    if (checkP > 0) {
      final p1 = Offset(c.dx - r * 0.30, c.dy + r * 0.04);
      final p2 = Offset(c.dx - r * 0.05, c.dy + r * 0.30);
      final p3 = Offset(c.dx + r * 0.37, c.dy - r * 0.27);

      final seg1 = (p2 - p1).distance;
      final seg2 = (p3 - p2).distance;
      final drawn = checkP * (seg1 + seg2);

      final path = Path()..moveTo(p1.dx, p1.dy);
      if (drawn <= seg1) {
        final t = drawn / seg1;
        path.lineTo(lerpDouble(p1.dx, p2.dx, t)!, lerpDouble(p1.dy, p2.dy, t)!);
      } else {
        path.lineTo(p2.dx, p2.dy);
        final t = (drawn - seg1) / seg2;
        path.lineTo(lerpDouble(p2.dx, p3.dx, t)!, lerpDouble(p2.dy, p3.dy, t)!);
      }

      canvas.drawPath(
        path,
        Paint()
          ..color = const Color(0xFF047857)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 4.5
          ..strokeCap = StrokeCap.round
          ..strokeJoin = StrokeJoin.round,
      );
    }
  }

  @override
  bool shouldRepaint(_CheckPainter old) => old.progress != progress;
}
