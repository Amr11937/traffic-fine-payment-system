import 'package:flutter_test/flutter_test.dart';
import 'package:traffic_fine_payment/main.dart';

void main() {
  testWidgets('App renders lookup screen', (WidgetTester tester) async {
    await tester.pumpWidget(const TrafficFineApp());
    expect(find.text('SL Police — Fine Payment'), findsOneWidget);
  });
}
