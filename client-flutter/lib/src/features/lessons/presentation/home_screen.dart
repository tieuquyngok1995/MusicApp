import 'package:flutter/material.dart';
import '../data/lesson_data.dart';
import 'widgets/lesson_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Danh sách bài học')),
      body: Padding(
        padding: const EdgeInsets.all(8.0), // tạo padding quanh grid
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2, // số cột
            mainAxisSpacing: 8, // khoảng cách giữa các hàng
            crossAxisSpacing: 8, // khoảng cách giữa các cột
            childAspectRatio: 10 / 2, // tỉ lệ width/height của item
          ),
          itemCount: sampleLessons.length,
          itemBuilder: (context, index) {
            final lesson = sampleLessons[index];
            return LessonCard(
              lesson: lesson,
              onTap: () {
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(SnackBar(content: Text('Mở ${lesson.title}')));
              },
            );
          },
        ),
      ),
    );
  }
}
