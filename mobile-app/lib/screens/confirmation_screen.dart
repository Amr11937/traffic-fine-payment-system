import 'package:flutter/material.dart';
import '../models/fine.dart';
import '../models/payment_result.dart';
import '../theme/app_colors.dart';
import '../widgets/animated_entrance.dart';
import '../widgets/branded_app_bar.dart';
import '../widgets/app_card.dart';
import '../widgets/detail_row.dart';
import '../widgets/animated_checkmark.dart';

class ConfirmationScreen extends StatefulWidget {
  final Fine fine;
  final PaymentResult result;

  const ConfirmationScreen({super.key, required this.fine, required this.result});

  @override
  State<ConfirmationScreen> createState() => _ConfirmationScreenState();
}

class _ConfirmationScreenState extends State<ConfirmationScreen>
    with TickerProviderStateMixin {
  // Checkmark draw animation
  late final AnimationController _checkCtrl;
  late final Animation<double>   _checkAnim;

  // Outer pulse ring
  late final AnimationController _pulseCtrl;
  late final Animation<double>   _pulseAnim;

  // Details section fade-in
  late final AnimationController _detailCtrl;
  late final Animation<double>   _detailFade;
  late final Animation<Offset>   _detailSlide;

  bool _detailsVisible = false;

  static String _fmtDate(String iso) {
    try {
      final d = DateTime.parse(iso);
      return '${d.day.toString().padLeft(2,'0')}/'
          '${d.month.toString().padLeft(2,'0')}/'
          '${d.year}  '
          '${d.hour.toString().padLeft(2,'0')}:'
          '${d.minute.toString().padLeft(2,'0')}';
    } catch (_) { return iso; }
  }

  static String _fmtAmount(double v) =>
      'LKR ${v.toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')}';

  @override
  void initState() {
    super.initState();

    // Checkmark: 0 → 1 over 900ms (easeOut)
    _checkCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _checkAnim = CurvedAnimation(parent: _checkCtrl, curve: Curves.easeOut);

    // Pulse ring: 1.0 → 1.4, fades out
    _pulseCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    _pulseAnim = CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeOut);

    // Details panel: fade + slide-up
    _detailCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 560));
    _detailFade  = CurvedAnimation(parent: _detailCtrl, curve: Curves.easeOut);
    _detailSlide = Tween<Offset>(begin: const Offset(0, 0.06), end: Offset.zero)
        .animate(CurvedAnimation(parent: _detailCtrl, curve: Curves.easeOutCubic));

    _checkCtrl.forward();
    // Start pulse at 40% into checkmark
    Future.delayed(const Duration(milliseconds: 360), () {
      if (mounted) _pulseCtrl.forward();
    });
    // Start details after checkmark completes
    Future.delayed(const Duration(milliseconds: 820), () {
      if (mounted) {
        setState(() => _detailsVisible = true);
        _detailCtrl.forward();
      }
    });
  }

  @override
  void dispose() {
    _checkCtrl.dispose();
    _pulseCtrl.dispose();
    _detailCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final fine   = widget.fine;
    final result = widget.result;

    return PopScope(
      canPop: false,
      child: Scaffold(
        appBar: const BrandedAppBar(
          title: 'Payment Confirmed',
          automaticallyImplyLeading: false,
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 32, 20, 36),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Animated checkmark ────────────────────────
                Center(
                  child: SizedBox(
                    width: 110,
                    height: 110,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Pulse ring
                        AnimatedBuilder(
                          animation: _pulseAnim,
                          builder: (_, _) {
                            final v = _pulseAnim.value;
                            return Transform.scale(
                              scale: 1.0 + v * 0.38,
                              child: Container(
                                width: 92,
                                height: 92,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: AppColors.greenFg.withAlpha(((1 - v) * 60).round()),
                                    width: 2,
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                        // Drawn checkmark
                        AnimatedBuilder(
                          animation: _checkAnim,
                          builder: (_, _) => AnimatedCheckmark(progress: _checkAnim.value),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // ── Title & amount ────────────────────────────
                AnimatedEntrance(
                  delay: const Duration(milliseconds: 700),
                  child: Column(
                    children: [
                      Text(
                        'Payment Successful',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.greenFg,
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Your fine has been settled.',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 22),

                // ── Amount panel (Hero from FineDetailsScreen) ─
                AnimatedEntrance(
                  delay: const Duration(milliseconds: 760),
                  child: Hero(
                    tag: 'fine-amount-${fine.referenceNumber}',
                    flightShuttleBuilder: _heroShuttle,
                    child: _ConfirmAmountPanel(amount: fine.amount),
                  ),
                ),

                const SizedBox(height: 18),

                // ── Transaction details (staggered fade-in) ───
                if (_detailsVisible)
                  FadeTransition(
                    opacity: _detailFade,
                    child: SlideTransition(
                      position: _detailSlide,
                      child: AppCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Transaction Details',
                                style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 12),
                            const Divider(),
                            const SizedBox(height: 6),
                            DetailRow('Transaction', result.transactionReference, monospace: true),
                            DetailRow('Fine Ref',    result.referenceNumber,      monospace: true),
                            DetailRow('Category',    fine.categoryDescription),
                            DetailRow('Vehicle',     fine.vehicleNumber),
                            DetailRow('Paid At',     _fmtDate(result.paidAt)),
                            DetailRow('Amount',      _fmtAmount(fine.amount), large: true),
                            DetailRow('Status',      'PAID',
                                valueColor: AppColors.greenFg),
                          ],
                        ),
                      ),
                    ),
                  ),

                if (_detailsVisible) ...[
                  const SizedBox(height: 14),

                  // ── SMS note ──────────────────────────────────
                  FadeTransition(
                    opacity: _detailFade,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: AppColors.blueBg,
                        border: Border.all(color: AppColors.blueBd),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(Icons.sms_outlined, color: AppColors.blueFg, size: 20),
                          SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'An SMS confirmation has been sent to the issuing officer.'
                              ' The driver may retrieve their licence.',
                              style: TextStyle(
                                color: AppColors.blueFg,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // ── Pay another fine button ───────────────────
                  FadeTransition(
                    opacity: _detailFade,
                    child: OutlinedButton(
                      onPressed: () => Navigator.popUntil(context, (r) => r.isFirst),
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size.fromHeight(52),
                      ),
                      child: const Text('Pay Another Fine'),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

Widget _heroShuttle(BuildContext _, Animation<double> anim, HeroFlightDirection _,
    BuildContext _, BuildContext dest) {
  return FadeTransition(opacity: anim, child: dest.widget);
}

// ── Confirmation amount panel (green-tinted) ──────────────────────────────────
class _ConfirmAmountPanel extends StatelessWidget {
  final double amount;
  const _ConfirmAmountPanel({required this.amount});

  static String _fmt(double v) =>
      'LKR ${v.toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')}';

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFF0FDF4), Color(0xFFF7FFF9)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.greenBd),
        boxShadow: const [
          BoxShadow(color: Color(0x14047857), blurRadius: 12, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'AMOUNT PAID',
            style: TextStyle(
              fontSize: 10.5, fontWeight: FontWeight.w800,
              letterSpacing: 1.1, color: AppColors.greenFg,
            ),
          ),
          Text(
            _fmt(amount),
            style: const TextStyle(
              fontSize: 22, fontWeight: FontWeight.w800,
              letterSpacing: -0.5, color: AppColors.navy800,
            ),
          ),
        ],
      ),
    );
  }
}
