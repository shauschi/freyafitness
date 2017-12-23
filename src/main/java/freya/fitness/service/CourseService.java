package freya.fitness.service;

import freya.fitness.domain.Course;
import freya.fitness.domain.CourseType;
import freya.fitness.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class CourseService {

  @Autowired
  private CourseRepository courseRepository;

  public Optional<Course> getCourse(final Long id) {
    return courseRepository.findById(id);
  }

  public List<Course> getCoursesFrom(final LocalDate from) {
    return courseRepository.findByStartGreaterThanEqual(from.atStartOfDay());
  }

  public List<Course> getCourses(final LocalDate from, final LocalDate to) {
    return courseRepository.findByStartBetween(from.atStartOfDay(), to.atTime(23, 59, 59));
  }

}
