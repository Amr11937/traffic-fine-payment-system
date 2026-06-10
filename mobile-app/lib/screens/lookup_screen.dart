import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/fine.dart';
import 'fine_details_screen.dart';

class LookupScreen extends StatefulWidget {
  const LookupScreen({super.key});

  @override
  State<LookupScreen> createState() => _LookupScreenState();
}

class _LookupScreenState extends State<LookupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _refController = TextEditingController();
  final _catController = TextEditingController();
  final _apiService = ApiService();

  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _refController.dispose();
    _catController.dispose();
    super.dispose();
  }

  Future<void> _lookup() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final Fine fine = await _apiService.lookupFine(
        _refController.text,
        _catController.text,
      );
      if (!mounted) return;
      await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => FineDetailsScreen(fine: fine),
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('SL Police — Fine Payment'),
        centerTitle: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          'Look Up Fine',
                          style: Theme.of(context)
                              .textTheme
                              .titleLarge
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Enter the details from the traffic fine notice.',
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(color: Colors.grey[600]),
                        ),
                        const SizedBox(height: 24),
                        TextFormField(
                          controller: _refController,
                          decoration: const InputDecoration(
                            labelText: 'Fine Reference Number',
                            hintText: 'e.g. TF-20260610-001',
                            border: OutlineInputBorder(),
                          ),
                          textInputAction: TextInputAction.next,
                          enabled: !_loading,
                          validator: (v) =>
                              (v == null || v.trim().isEmpty)
                                  ? 'Please enter the reference number'
                                  : null,
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _catController,
                          decoration: const InputDecoration(
                            labelText: 'Category Code',
                            hintText: 'e.g. SPD',
                            border: OutlineInputBorder(),
                          ),
                          textCapitalization: TextCapitalization.characters,
                          textInputAction: TextInputAction.done,
                          enabled: !_loading,
                          onFieldSubmitted: (_) => _lookup(),
                          validator: (v) =>
                              (v == null || v.trim().isEmpty)
                                  ? 'Please enter the category code'
                                  : null,
                        ),
                        const SizedBox(height: 24),
                        if (_loading)
                          const LinearProgressIndicator()
                        else
                          FilledButton(
                            onPressed: _lookup,
                            style: FilledButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: const Text(
                              'Look Up Fine',
                              style: TextStyle(fontSize: 16),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 16),
                  _ErrorBanner(message: _error!),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  final String message;
  const _ErrorBanner({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF2F2),
        border: Border.all(color: const Color(0xFFFECACA)),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.error_outline, color: Color(0xFF991B1B), size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(color: Color(0xFF991B1B), fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }
}
