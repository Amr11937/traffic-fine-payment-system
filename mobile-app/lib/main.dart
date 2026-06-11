import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme/app_theme.dart';
import 'screens/lookup_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const TrafficFineApp());
}

class TrafficFineApp extends StatelessWidget {
  const TrafficFineApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SL Police Fine Payment',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      home: const LookupScreen(),
    );
  }
}
