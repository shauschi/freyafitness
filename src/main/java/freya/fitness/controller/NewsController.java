package freya.fitness.controller;

import freya.fitness.dto.NewsPreviewDto;
import freya.fitness.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/news")
public class NewsController {

  @Autowired
  private NewsService newsService;

  @GetMapping("/previews")
  public List<NewsPreviewDto> getNewsPreviews() {
    return newsService.getCurrentNews().stream()
        .map(NewsPreviewDto::new)
        .collect(Collectors.toList());
  }
}
