import 'package:flutter/material.dart';
import '../models/fine.dart';
import '../services/api_service.dart';
import '../theme/app_colors.dart';
import '../utils/routes.dart';
import '../widgets/animated_entrance.dart';
import '../widgets/branded_app_bar.dart';
import '../widgets/app_card.dart';
import '../widgets/detail_row.dart';
import 'confirmation_screen.dart';

class FineDetailsScreen extends StatefulWidget {
  final Fine fine;
  const FineDetailsScreen({super.key, required this.fine});

  @override
  State<FineDetailsScreen> createState() => _FineDetailsScreenState();
}

class _FineDetailsScreenState extends State<FineDetailsScreen> {
  final _api           = ApiService();
  String  _method      = 'CARD';
  bool    _loading     = false;
  String? _error;

  static String _fmtDate(String iso) {
    try {
      final d = DateTime.parse(iso);
      return '${d.day.toString().padLeft(2, '0')}/'
          '${d.month.toString().padLeft(2, '0')}/${d.year}';
    } catch (_) { return iso; }
  }

  static String _fmtAmount(double v) =>
      'LKR ${v.toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')}';

  Future<void> _pay() async {
    setState(() { _loading = true; _error = null; });
    try {
      final result = await _api.processPayment(
        referenceNumber: widget.fine.referenceNumber,
        categoryCode:    widget.fine.categoryCode,
        paymentMethod:   _method,
        amount:          widget.fine.amount,
      );
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        slideRoute(ConfirmationScreen(fine: widget.fine, result: result)),
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
      appBar: const BrandedAppBar(title: 'Fine Details'),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ── Fine details card ─────────────────────────────
              AnimatedEntrance(
                delay: const Duration(milliseconds: 40),
                child: AppCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Fine Details',
                              style: Theme.of(context).textTheme.titleLarge),
                          _StatusChip(isPaid: fine.isPaid),
                        ],
                      ),
                      const SizedBox(height: 16),
                      const Divider(),
                      const SizedBox(height: 8),
                      DetailRow('Reference', fine.referenceNumber, monospace: true),
                      DetailRow('Category', '${fine.categoryCode} — ${fine.categoryDescription}'),
                      DetailRow('Vehicle', fine.vehicleNumber),
                      DetailRow('Issued', _fmtDate(fine.issuedAt)),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // ── Amount panel (Hero shared with ConfirmationScreen) ──
              AnimatedEntrance(
                delay: const Duration(milliseconds: 100),
                child: Hero(
                  tag: 'fine-amount-${fine.referenceNumber}',
                  flightShuttleBuilder: _heroShuttle,
                  child: _AmountPanel(amount: fine.amount),
                ),
              ),

              const SizedBox(height: 14),

              // ── Payment / already-paid block ─────────────────
              AnimatedEntrance(
                delay: const Duration(milliseconds: 160),
                child: fine.isPaid
                    ? _InfoNote(
                        icon: Icons.check_circle_outline_rounded,
                        bgColor: AppColors.greenBg,
                        bdColor: AppColors.greenBd,
                        fgColor: AppColors.greenFg,
                        message: 'This fine has already been paid. No further action is required.',
                      )
                    : AppCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text('Select Payment Method',
                                style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 14),
                            for (final m in _kMethods) ...[
                              _PaymentMethodCard(
                                value:    m.$1,
                                label:    m.$2,
                                icon:     m.$3,
                                selected: _method == m.$1,
                                enabled:  !_loading,
                                onTap:    () => setState(() => _method = m.$1),
                              ),
                              if (m != _kMethods.last) const SizedBox(height: 10),
                            ],
                            const SizedBox(height: 20),
                            _PayButton(
                              loading: _loading,
                              label: 'Pay ${_fmtAmount(fine.amount)}',
                              onTap: _pay,
                            ),
                          ],
                        ),
                      ),
              ),

              // ── Error ────────────────────────────────────────
              AnimatedSize(
                duration: const Duration(milliseconds: 280),
                curve: Curves.easeOutCubic,
                child: _error != null
                    ? Padding(
                        padding: const EdgeInsets.only(top: 14),
                        child: AnimatedEntrance(
                          child: _InfoNote(
                            icon: Icons.error_outline_rounded,
                            bgColor: AppColors.redBg,
                            bdColor: AppColors.redBd,
                            fgColor: AppColors.redFg,
                            message: _error!,
                          ),
                        ),
                      )
                    : const SizedBox.shrink(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Hero shuttle builder — keeps the panel visible mid-flight ────────────────
Widget _heroShuttle(BuildContext _, Animation<double> anim, HeroFlightDirection _,
    BuildContext _, BuildContext dest) {
  return FadeTransition(
    opacity: anim,
    child: dest.widget,
  );
}

// ── Payment methods data ─────────────────────────────────────────────────────
const _kMethods = [
  ('CARD',   'Credit / Debit Card', Icons.credit_card_rounded),
  ('ONLINE', 'Online Banking',      Icons.account_balance_outlined),
  ('CASH',   'Cash',                Icons.payments_outlined),
];

// ── Amount panel ─────────────────────────────────────────────────────────────
class _AmountPanel extends StatelessWidget {
  final double amount;
  const _AmountPanel({required this.amount});

  static String _fmt(double v) =>
      'LKR ${v.toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')}';

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFDF6E3), Color(0xFFFFFAF0)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.amberBd),
        boxShadow: const [
          BoxShadow(color: Color(0x14D4A017), blurRadius: 12, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'AMOUNT DUE',
            style: TextStyle(
              fontSize: 10.5,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.1,
              color: AppColors.gold,
            ),
          ),
          Text(
            _fmt(amount),
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.5,
              color: AppColors.navy800,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Payment method card (replaces RadioListTile) ─────────────────────────────
class _PaymentMethodCard extends StatelessWidget {
  final String   value;
  final String   label;
  final IconData icon;
  final bool     selected;
  final bool     enabled;
  final VoidCallback onTap;

  const _PaymentMethodCard({
    required this.value,
    required this.label,
    required this.icon,
    required this.selected,
    required this.enabled,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeOut,
      decoration: BoxDecoration(
        color: selected ? AppColors.navy.withAlpha(13) : Colors.white,
        border: Border.all(
          color: selected ? AppColors.navy : AppColors.gray300,
          width: selected ? 1.8 : 1.2,
        ),
        borderRadius: BorderRadius.circular(12),
        boxShadow: selected
            ? [BoxShadow(color: AppColors.navy.withAlpha(30), blurRadius: 8, offset: const Offset(0, 2))]
            : null,
      ),
      child: InkWell(
        onTap: enabled ? onTap : null,
        borderRadius: BorderRadius.circular(12),
        splashColor: AppColors.navy.withAlpha(20),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Icon(icon, size: 20,
                  color: selected ? AppColors.navy : AppColors.gray500),
              const SizedBox(width: 12),
              Expanded(
                child: Text(label,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                      color: selected ? AppColors.navy : AppColors.gray700,
                    )),
              ),
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                child: selected
                    ? const Icon(Icons.check_circle_rounded,
                        key: ValueKey('check'), color: AppColors.navy, size: 20)
                    : const SizedBox(key: ValueKey('empty'), width: 20, height: 20),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Pay button with scale micro-interaction ───────────────────────────────────
class _PayButton extends StatefulWidget {
  final bool loading;
  final String label;
  final VoidCallback onTap;
  const _PayButton({required this.loading, required this.label, required this.onTap});

  @override
  State<_PayButton> createState() => _PayButtonState();
}

class _PayButtonState extends State<_PayButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _press;
  late final Animation<double>   _scale;

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
            minimumSize: const Size.fromHeight(52),
          ),
          child: widget.loading
              ? const SizedBox(
                  width: 22, height: 22,
                  child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white))
              : Text(widget.label),
        ),
      ),
    );
  }
}

// ── Status chip ───────────────────────────────────────────────────────────────
class _StatusChip extends StatelessWidget {
  final bool isPaid;
  const _StatusChip({required this.isPaid});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 5),
      decoration: BoxDecoration(
        color:        isPaid ? AppColors.greenBg : AppColors.amberBg,
        border: Border.all(color: isPaid ? AppColors.greenBd : AppColors.amberBd),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6, height: 6,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isPaid ? AppColors.greenFg : AppColors.amberFg,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            isPaid ? 'PAID' : 'UNPAID',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: isPaid ? AppColors.greenFg : AppColors.amberFg,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Info / error note banner ──────────────────────────────────────────────────
class _InfoNote extends StatelessWidget {
  final IconData icon;
  final Color bgColor, bdColor, fgColor;
  final String message;

  const _InfoNote({
    required this.icon, required this.bgColor,
    required this.bdColor, required this.fgColor, required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: bgColor,
        border: Border.all(color: bdColor),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: fgColor, size: 20),
          const SizedBox(width: 10),
          Expanded(child: Text(message,
              style: TextStyle(color: fgColor, fontSize: 14, fontWeight: FontWeight.w500))),
        ],
      ),
    );
  }
}
