package freya.fitness;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {
		"mail.host=testhost",
		"mail.port=1234",
		"mail.username=user",
		"mail.password=pw"})
public class WebpageApplicationTests {

	@Ignore // Es wird eine application.yml für test benötigt
	@Test
	public void contextLoads() {
	}

}
