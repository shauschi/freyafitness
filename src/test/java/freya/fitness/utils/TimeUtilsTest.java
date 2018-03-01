package freya.fitness.utils;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

@RunWith(MockitoJUnitRunner.class)
public class TimeUtilsTest {

  @Test
  public void test_nextFullHour_nullDoesNotCauseAnError() {
    LocalDateTime result = TimeUtils.nextFullHour(null);

    assertThat(result, notNullValue());
  }

  @Test
  public void test_nextFullHour() {
    LocalDateTime dateTime = LocalDateTime.of(
      LocalDate.of(2018, 2, 21),
      LocalTime.of(13, 59, 59)
    );

    LocalDateTime result = TimeUtils.nextFullHour(dateTime);

    assertThat(result, notNullValue());
    assertThat(result.getYear(), equalTo(2018));
    assertThat(result.getMonth(), equalTo(Month.FEBRUARY));
    assertThat(result.getDayOfMonth(), equalTo(21));
    assertThat(result.getHour(), equalTo(14));
    assertThat(result.getMinute(), equalTo(0));
    assertThat(result.getSecond(), equalTo(0));
  }

  @Test
  public void test_nextFullHourIsNextDay() {
    LocalDateTime dateTime = LocalDateTime.of(
      LocalDate.of(2018, 2, 21),
      LocalTime.of(23, 59, 59)
    );

    LocalDateTime result = TimeUtils.nextFullHour(dateTime);

    assertThat(result, notNullValue());
    assertThat(result.getYear(), equalTo(2018));
    assertThat(result.getMonth(), equalTo(Month.FEBRUARY));
    assertThat(result.getDayOfMonth(), equalTo(22));
    assertThat(result.getHour(), equalTo(0));
    assertThat(result.getMinute(), equalTo(0));
    assertThat(result.getSecond(), equalTo(0));
  }
}