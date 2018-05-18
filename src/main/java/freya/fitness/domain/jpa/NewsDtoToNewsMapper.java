package freya.fitness.domain.jpa;

import freya.fitness.dto.NewsDto;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.function.BiFunction;

@Component
public class NewsDtoToNewsMapper implements BiFunction<NewsDto, News, News> {

  @Override
  public News apply(NewsDto newsDto, News existingNews) {
    if (newsDto == null) {
      return null;
    }
    final News news = Optional.ofNullable(existingNews).orElseGet(News::new);

    news.setTitle(newsDto.getTitle());
    news.setTeaser(newsDto.getTeaser());
    news.setText(newsDto.getText());
    news.setPictureId(newsDto.getPictureId());
    news.setValidity(newsDto.getValidity().toValidity());

    return news;
  }
}
