package freya.fitness.api.membership;

import freya.fitness.api.course.Course;
import freya.fitness.api.course.CourseMapper;
import freya.fitness.api.course.CourseOverviewDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ParticipationMapper {

  @Autowired
  private CourseMapper courseMapper;

  public ParticipationDto map(final Participation participation) {
    if (participation == null) {
      return null;
    }

    final ParticipationDto dto = new ParticipationDto();
    dto.setId(participation.getId());
    final Course course = participation.getCourse();
    final CourseOverviewDto courseDto = courseMapper.map(course, participation);
    dto.setCourse(courseDto);

    return dto;
  }

}
