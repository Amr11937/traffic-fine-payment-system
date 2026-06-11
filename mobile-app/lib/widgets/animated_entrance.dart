import 'package:flutter/material.dart';

/// Wraps [child] in a fade + slide-up entrance animation.
/// [delay] staggers items in a list; [duration] controls the animation length.
class AnimatedEntrance extends StatefulWidget {
  final Widget child;
  final Duration delay;
  final Duration duration;
  final Offset slideFrom;

  const AnimatedEntrance({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = const Duration(milliseconds: 420),
    this.slideFrom = const Offset(0, 0.055),
  });

  @override
  State<AnimatedEntrance> createState() => _AnimatedEntranceState();
}

class _AnimatedEntranceState extends State<AnimatedEntrance>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _fade;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: widget.duration);

    _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);
    _slide = Tween<Offset>(begin: widget.slideFrom, end: Offset.zero)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic));

    if (widget.delay == Duration.zero) {
      _ctrl.forward();
    } else {
      Future.delayed(widget.delay, () {
        if (mounted) _ctrl.forward();
      });
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) =>
      FadeTransition(opacity: _fade, child: SlideTransition(position: _slide, child: widget.child));
}
