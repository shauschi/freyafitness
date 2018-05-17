package freya.fitness.service;

import freya.fitness.domain.jpa.News;
import freya.fitness.repository.jpa.NewsRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class NewsServiceTest {

  @InjectMocks
  private NewsService testee;

  @Mock
  private NewsRepository newsRepository;

  @Test
  public void test_getCurrentNews() {
    News news1 = new News();
    news1.setTitle("News title 1");
    News news2 = new News();
    news2.setTitle("News title 2");
    List<News> newsList = Arrays.asList(news1, news2);
    when(newsRepository.findByValidityFromLessThanEqualAndValidityToGreaterThanEqual(any(), any()))
        .thenReturn(newsList);

    List<News> result = testee.getCurrentNews();

    assertThat(result.size(), equalTo(2));
    assertThat(result.get(0).getTitle(), equalTo("News title 1"));
    assertThat(result.get(1).getTitle(), equalTo("News title 2"));
  }
}