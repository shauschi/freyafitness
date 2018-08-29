package freya.fitness.api.mapping;

import freya.fitness.api.dto.CourseDto;
import freya.fitness.api.dto.ParticipationDto;
import freya.fitness.api.dto.ProfileDto;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.User;
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
    final CourseDto courseDto = courseMapper.map(course);
    dto.setCourse(courseDto);

    return dto;
  }

}
