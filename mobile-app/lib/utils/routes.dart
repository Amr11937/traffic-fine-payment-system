import 'package:flutter/material.dart';

/// Slide-right-and-fade page transition. Drop-in replacement for MaterialPageRoute.
PageRoute<T> slideRoute<T>(Widget page) {
  return PageRouteBuilder<T>(
    pageBuilder: (_, _, _) => page,
    transitionsBuilder: (_, animation, _, child) {
      final slide = Tween<Offset>(
        begin: const Offset(0.06, 0),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOutCubic));

      return FadeTransition(
        opacity: CurvedAnimation(parent: animation, curve: Curves.easeOut),
        child: SlideTransition(position: slide, child: child),
      );
    },
    transitionDuration: const Duration(milliseconds: 360),
    reverseTransitionDuration: const Duration(milliseconds: 260),
  );
}
