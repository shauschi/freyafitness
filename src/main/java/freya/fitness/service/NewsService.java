package freya.fitness.service;

import freya.fitness.domain.jpa.News;
import freya.fitness.repository.jpa.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsService {

  @Autowired
  private NewsRepository newsRepository;

  public List<News> getCurrentNews() {
    final LocalDateTime now = LocalDateTime.now();
    return newsRepository
        .findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
            now, now);
  }

}
