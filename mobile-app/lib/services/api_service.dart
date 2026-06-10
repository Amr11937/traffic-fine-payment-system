import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../models/fine.dart';
import '../models/payment_result.dart';

class ApiService {
  static const String _base = Config.apiBaseUrl;

  Future<Fine> lookupFine(String referenceNumber, String categoryCode) async {
    final uri = Uri.parse('$_base/api/fines/lookup').replace(
      queryParameters: {
        'referenceNumber': referenceNumber.trim(),
        'categoryCode': categoryCode.trim().toUpperCase(),
      },
    );
    try {
      final res = await http.get(uri).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        return Fine.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
      }
      if (res.statusCode == 404) {
        throw ApiException('Fine not found. Check the reference number.');
      }
      if (res.statusCode == 400) {
        throw ApiException('Category code does not match this fine reference.');
      }
      throw ApiException('Unexpected error (${res.statusCode}). Please try again.');
    } on ApiException {
      rethrow;
    } on SocketException {
      throw ApiException('Could not reach the server. Check your WiFi connection.');
    } on HttpException {
      throw ApiException('Could not reach the server. Check your WiFi connection.');
    } catch (_) {
      throw ApiException('Could not reach the server. Check your WiFi connection.');
    }
  }

  Future<PaymentResult> processPayment({
    required String referenceNumber,
    required String categoryCode,
    required String paymentMethod,
    required double amount,
  }) async {
    final uri = Uri.parse('$_base/api/payments');
    try {
      final res = await http
          .post(
            uri,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'referenceNumber': referenceNumber,
              'categoryCode': categoryCode,
              'paymentMethod': paymentMethod,
              'amount': amount,
            }),
          )
          .timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        return PaymentResult.fromJson(
            jsonDecode(res.body) as Map<String, dynamic>);
      }
      if (res.statusCode == 409) {
        throw ApiException('This fine has already been paid.');
      }
      if (res.statusCode == 400) {
        throw ApiException('Payment could not be processed. Check the details.');
      }
      throw ApiException('Payment failed (${res.statusCode}). Please try again.');
    } on ApiException {
      rethrow;
    } on SocketException {
      throw ApiException('Could not reach the server. Check your WiFi connection.');
    } on HttpException {
      throw ApiException('Could not reach the server. Check your WiFi connection.');
    } catch (_) {
      throw ApiException('Could not reach the server. Check your WiFi connection.');
    }
  }
}

class ApiException implements Exception {
  final String message;
  const ApiException(this.message);

  @override
  String toString() => message;
}
