package freya.fitness.controller;

import freya.fitness.domain.jpa.News;
import freya.fitness.dto.NewsDto;
import freya.fitness.dto.NewsPreviewDto;
import freya.fitness.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/news")
public class NewsController {

  private final NewsService newsService;

  @Autowired
  public NewsController(final NewsService newsService) {
    this.newsService = newsService;
  }

  @GetMapping("/previews")
  public List<NewsPreviewDto> getNewsPreviews() {
    return newsService.getCurrentNews().stream()
        .map(NewsPreviewDto::new)
        .collect(Collectors.toList());
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @GetMapping("/create")
  public NewsDto createNewNews() {
    final News news = newsService.createEmptyNews();
    return new NewsDto(news);
  }

  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PostMapping("/create")
  public NewsDto saveNewCourse(@RequestBody final NewsDto newsDto) {
    final News news = newsService.create(newsDto);
    return new NewsDto(news);
  }

}
