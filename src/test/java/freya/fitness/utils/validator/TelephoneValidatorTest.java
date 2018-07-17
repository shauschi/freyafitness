package freya.fitness.utils.validator;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(MockitoJUnitRunner.class)
public class TelephoneValidatorTest {

  @InjectMocks
  private TelephoneValidator testee;

  @Test
  public void testTelephone() {
    assertThat(testee.isValid("0123abc", null), is(false));

    assertThat(testee.isValid("0123 12345678", null), is(true));
    assertThat(testee.isValid("012312345678", null), is(true));
    assertThat(testee.isValid("+49 123 12345678", null), is(true));
    assertThat(testee.isValid("+49 12312345678", null), is(true));
    assertThat(testee.isValid("+49123 12345678", null), is(true));
    assertThat(testee.isValid("+4912312345678", null), is(true));
    assertThat(testee.isValid("0049 123 12345678", null), is(true));
    assertThat(testee.isValid("0049 12312345678", null), is(true));
    assertThat(testee.isValid("0049123 12345678", null), is(true));
    assertThat(testee.isValid("004912312345678", null), is(true));

    assertThat(testee.isValid("0123-12345678", null), is(true));
    assertThat(testee.isValid("012312345678", null), is(true));
    assertThat(testee.isValid("+49-123-12345678", null), is(true));
    assertThat(testee.isValid("+49-12312345678", null), is(true));
    assertThat(testee.isValid("+49123-12345678", null), is(true));
    assertThat(testee.isValid("+4912312345678", null), is(true));
    assertThat(testee.isValid("0049-123-12345678", null), is(true));
    assertThat(testee.isValid("0049-12312345678", null), is(true));
    assertThat(testee.isValid("0049123-12345678", null), is(true));
    assertThat(testee.isValid("004912312345678", null), is(true));

    assertThat(testee.isValid("0123/12345678", null), is(true));
    assertThat(testee.isValid("012312345678", null), is(true));
  }

}