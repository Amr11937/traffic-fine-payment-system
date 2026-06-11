import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/fine.dart';
import '../theme/app_colors.dart';
import '../utils/routes.dart';
import '../widgets/animated_entrance.dart';
import '../widgets/branded_app_bar.dart';
import '../widgets/app_card.dart';
import 'fine_details_screen.dart';

class LookupScreen extends StatefulWidget {
  const LookupScreen({super.key});

  @override
  State<LookupScreen> createState() => _LookupScreenState();
}

class _LookupScreenState extends State<LookupScreen> {
  final _formKey      = GlobalKey<FormState>();
  final _refCtrl      = TextEditingController();
  final _catCtrl      = TextEditingController();
  final _apiService   = ApiService();

  bool    _loading = false;
  String? _error;

  @override
  void dispose() {
    _refCtrl.dispose();
    _catCtrl.dispose();
    super.dispose();
  }

  Future<void> _lookup() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });
    try {
      final Fine fine = await _apiService.lookupFine(_refCtrl.text, _catCtrl.text);
      if (!mounted) return;
      await Navigator.push(context, slideRoute(FineDetailsScreen(fine: fine)));
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const BrandedAppBar(
        title: 'Traffic Fine Payment',
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 28, 20, 32),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Header copy ──────────────────────────────────
                AnimatedEntrance(
                  delay: const Duration(milliseconds: 40),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Look Up Your Fine',
                          style: Theme.of(context).textTheme.headlineSmall),
                      const SizedBox(height: 6),
                      Text(
                        'Enter the details printed on your traffic fine notice.',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 28),

                // ── Form card ────────────────────────────────────
                AnimatedEntrance(
                  delay: const Duration(milliseconds: 110),
                  child: AppCard(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        TextFormField(
                          controller: _refCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Fine Reference Number',
                            hintText: 'e.g. TF-20260610-001',
                            prefixIcon: Icon(Icons.receipt_long_outlined, size: 20),
                          ),
                          textInputAction: TextInputAction.next,
                          enabled: !_loading,
                          validator: (v) => (v == null || v.trim().isEmpty)
                              ? 'Please enter the reference number'
                              : null,
                        ),
                        const SizedBox(height: 18),
                        TextFormField(
                          controller: _catCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Category Code',
                            hintText: 'e.g. SPD',
                            prefixIcon: Icon(Icons.label_outline, size: 20),
                            helperText: 'The short offence code on the notice',
                          ),
                          textCapitalization: TextCapitalization.characters,
                          textInputAction: TextInputAction.done,
                          enabled: !_loading,
                          onFieldSubmitted: (_) => _lookup(),
                          validator: (v) => (v == null || v.trim().isEmpty)
                              ? 'Please enter the category code'
                              : null,
                        ),
                        const SizedBox(height: 28),
                        _LookupButton(loading: _loading, onTap: _lookup),
                      ],
                    ),
                  ),
                ),

                // ── Error banner ─────────────────────────────────
                AnimatedSize(
                  duration: const Duration(milliseconds: 280),
                  curve: Curves.easeOutCubic,
                  child: _error != null
                      ? Padding(
                          padding: const EdgeInsets.only(top: 16),
                          child: AnimatedEntrance(child: _ErrorBanner(message: _error!)),
                        )
                      : const SizedBox.shrink(),
                ),

                const SizedBox(height: 32),

                // ── Trust badges ─────────────────────────────────
                AnimatedEntrance(
                  delay: const Duration(milliseconds: 200),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.lock_outline, size: 13, color: AppColors.gray400),
                      const SizedBox(width: 5),
                      Text(
                        'Secure · Sri Lanka Police Traffic Division',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              fontSize: 11, color: AppColors.gray400,
                            ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Loading-aware submit button ───────────────────────────────────────────────
class _LookupButton extends StatefulWidget {
  final bool loading;
  final VoidCallback onTap;
  const _LookupButton({required this.loading, required this.onTap});

  @override
  State<_LookupButton> createState() => _LookupButtonState();
}

class _LookupButtonState extends State<_LookupButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _press;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _press = AnimationController(vsync: this, duration: const Duration(milliseconds: 100));
    _scale = Tween<double>(begin: 1, end: 0.97)
        .animate(CurvedAnimation(parent: _press, curve: Curves.easeInOut));
  }

  @override
  void dispose() { _press.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) { if (!widget.loading) _press.forward(); },
      onTapUp:   (_) { _press.reverse(); },
      onTapCancel: ()  { _press.reverse(); },
      onTap: widget.loading ? null : widget.onTap,
      child: ScaleTransition(
        scale: _scale,
        child: FilledButton(
          onPressed: widget.loading ? null : widget.onTap,
          style: FilledButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
            minimumSize: const Size.fromHeight(52),
          ),
          child: widget.loading
              ? const SizedBox(
                  width: 22, height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5, color: Colors.white,
                  ),
                )
              : const Text('Look Up Fine'),
        ),
      ),
    );
  }
}

// ── Error banner ──────────────────────────────────────────────────────────────
class _ErrorBanner extends StatelessWidget {
  final String message;
  const _ErrorBanner({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.redBg,
        border: Border.all(color: AppColors.redBd),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.error_outline_rounded, color: AppColors.redFg, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(message,
                style: const TextStyle(color: AppColors.redFg, fontSize: 14, fontWeight: FontWeight.w500)),
          ),
        ],
      ),
    );
  }
}
