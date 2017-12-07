package freya.fitness.controller;

import freya.fitness.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/courses")
public class CourseController {

  @Autowired
  private CourseService courseService;

  @RequestMapping("/{id}")
  @ResponseBody
  public CourseDetailDto getCourseDetails(@PathVariable("id") final Long id) {
    return courseService.getCourse(id)
        .map(CourseDetailDto::new)
        .orElse(null);
  }

  @RequestMapping("/from/{from}")
  @ResponseBody
  public List<CourseDto> getCourses(@PathVariable("from") final String from) {
    return courseService.getCourses(LocalDate.parse(from), null)
        .stream()
        .map(CourseDto::new)
        .collect(Collectors.toList());
  }

  @RequestMapping("from/{from}/to/{to}")
  @ResponseBody
  public List<CourseDto> getCourses(
      @PathVariable("from") final String from,
      @PathVariable("to") final String to) {
    return courseService.getCourses(LocalDate.parse(from), LocalDate.parse(to))
        .stream()
        .map(CourseDto::new)
        .collect(Collectors.toList());
  }
}
