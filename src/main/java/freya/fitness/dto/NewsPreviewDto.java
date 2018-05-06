package freya.fitness.dto;

import freya.fitness.domain.jpa.News;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NewsPreviewDto {

  private String id;
  private String title;
  private String teaser;
  private Long pictureId;

  public NewsPreviewDto(News news) {
    this.id = news.getId();
    this.title = news.getTitle();
    this.teaser = news.getTeaser();
    this.pictureId = news.getPictureId();
  }
}
