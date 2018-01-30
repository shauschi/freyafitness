package freya.fitness.service;

import freya.fitness.domain.News;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class NewsService {

  public List<News> getCurrentNews() {
    return Arrays.asList(
        news(1L, "Neue App", "Jetzt gliech online anmelden"),
        news(2L, "Neuer Ort",
            "Kurse finden jetzt teilweise im Schützenhaus statt." +
                " Bitte informiert euch, wo euer Kurs stattfindet."),
        news(3L, "XLETIX",
            "Wir wollen mit einem Team an den" +
                " XLETIX Norddeutschland teilnehmen.")
    );
  }

  private News news(Long id, String title, String teaser) {
    News news = new News();
    news.setId(id);
    news.setTitle(title);
    news.setTeaser(teaser);
    news.setPictureId(id);
    return news;
  }

}
