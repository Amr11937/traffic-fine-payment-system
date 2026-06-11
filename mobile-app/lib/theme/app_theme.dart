import 'package:flutter/material.dart';
import 'app_colors.dart';

abstract final class AppTheme {
  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.navy,
        brightness: Brightness.light,
        primary: AppColors.navy,
        onPrimary: Colors.white,
        surface: AppColors.surface,
      ),
      scaffoldBackgroundColor: AppColors.bg,

      textTheme: const TextTheme(
        headlineMedium: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, letterSpacing: -0.5, color: AppColors.ink),
        headlineSmall:  TextStyle(fontSize: 22, fontWeight: FontWeight.w700, letterSpacing: -0.3, color: AppColors.ink),
        titleLarge:     TextStyle(fontSize: 18, fontWeight: FontWeight.w700, letterSpacing: -0.2, color: AppColors.ink),
        titleMedium:    TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.ink),
        bodyLarge:      TextStyle(fontSize: 15, fontWeight: FontWeight.w400, color: AppColors.gray700),
        bodyMedium:     TextStyle(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.gray700),
        bodySmall:      TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.gray500),
        labelLarge:     TextStyle(fontSize: 15, fontWeight: FontWeight.w700, letterSpacing: 0.1, color: Colors.white),
      ),

      cardTheme: const CardThemeData(
        elevation: 0,
        margin: EdgeInsets.zero,
        color: AppColors.surface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.gray300, width: 1.5),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.gray300, width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.navy, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.redFg, width: 1.5),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.redFg, width: 2),
        ),
        labelStyle: const TextStyle(color: AppColors.gray500, fontWeight: FontWeight.w500, fontSize: 15),
        floatingLabelStyle: const TextStyle(color: AppColors.navy, fontWeight: FontWeight.w600, fontSize: 13),
        hintStyle: const TextStyle(color: AppColors.gray400, fontSize: 14),
        errorStyle: const TextStyle(color: AppColors.redFg, fontSize: 12, fontWeight: FontWeight.w500),
      ),

      filledButtonTheme: FilledButtonThemeData(
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.resolveWith((s) =>
              s.contains(WidgetState.disabled) ? const Color(0xFF9DB8D2) : AppColors.navy),
          foregroundColor: WidgetStateProperty.all(Colors.white),
          shape: WidgetStateProperty.all(
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          elevation: WidgetStateProperty.resolveWith((s) =>
              s.contains(WidgetState.pressed) ? 0 : 3),
          shadowColor: WidgetStateProperty.all(AppColors.navy.withAlpha(80)),
          overlayColor: WidgetStateProperty.resolveWith((s) =>
              s.contains(WidgetState.pressed)
                  ? Colors.white.withAlpha(26)
                  : Colors.white.withAlpha(10)),
          animationDuration: const Duration(milliseconds: 140),
          padding: WidgetStateProperty.all(
            const EdgeInsets.symmetric(vertical: 16),
          ),
          textStyle: WidgetStateProperty.all(
            const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, letterSpacing: 0.1),
          ),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: ButtonStyle(
          foregroundColor: WidgetStateProperty.all(AppColors.navy),
          side: WidgetStateProperty.all(
            const BorderSide(color: AppColors.navy, width: 1.5),
          ),
          shape: WidgetStateProperty.all(
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          padding: WidgetStateProperty.all(const EdgeInsets.symmetric(vertical: 16)),
          textStyle: WidgetStateProperty.all(
            const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, letterSpacing: 0.1),
          ),
          overlayColor: WidgetStateProperty.all(AppColors.navy.withAlpha(15)),
        ),
      ),

      radioTheme: RadioThemeData(
        fillColor: WidgetStateProperty.resolveWith((s) =>
            s.contains(WidgetState.selected) ? AppColors.navy : AppColors.gray300),
      ),

      dividerTheme: const DividerThemeData(
        color: AppColors.gray200,
        thickness: 1,
        space: 1,
      ),
    );
  }
}
