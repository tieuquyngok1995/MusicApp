import 'package:flutter/material.dart';
import '../../domain/lesson.dart';

class LessonCard extends StatelessWidget {
  final Lesson lesson;
  final VoidCallback? onTap;

  const LessonCard({super.key, required this.lesson, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: ListTile(
        title: Text(lesson.title),
        trailing: Icon(
          lesson.isCompleted ? Icons.check_circle : Icons.circle_outlined,
          color: lesson.isCompleted ? Colors.green : Colors.grey,
        ),
        onTap: onTap,
      ),
    );
  }
}
