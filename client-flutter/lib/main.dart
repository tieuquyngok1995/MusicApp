import 'package:flutter/material.dart';
import 'src/features/lessons/presentation/home_screen.dart'; // import màn hình Home

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Music Learning App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const HomeScreen(), // dùng HomeScreen
    );
  }
}
