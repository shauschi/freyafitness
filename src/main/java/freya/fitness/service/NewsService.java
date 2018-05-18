package freya.fitness.service;

import freya.fitness.domain.jpa.News;
import freya.fitness.domain.jpa.NewsDtoToNewsMapper;
import freya.fitness.domain.jpa.Validity;
import freya.fitness.dto.NewsDto;
import freya.fitness.repository.jpa.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsService {

  private final NewsRepository newsRepository;

  private NewsDtoToNewsMapper newsDtoToNewsMapper;

  @Autowired
  public NewsService(
      final NewsRepository newsRepository,
      final NewsDtoToNewsMapper newsDtoToNewsMapper) {
    this.newsRepository = newsRepository;
    this.newsDtoToNewsMapper = newsDtoToNewsMapper;
  }

  public List<News> getCurrentNews() {
    final LocalDateTime now = LocalDateTime.now();
    return newsRepository
        .findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(
            now, now);
  }

  public News createEmptyNews() {
    final News news = new News();
    news.setTitle("Neuer Titel");
    news.setValidity(Validity.starTomorrow());
    return news;
  }

  public News create(NewsDto newsDto) {
    final News news = newsDtoToNewsMapper.apply(newsDto, null);
    return save(news);
  }

  private News save(News news) {
    if (news == null) {
      return null;
    }
    return newsRepository.save(news);
  }

}
