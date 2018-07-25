package freya.fitness.service;

import freya.fitness.utils.exception.ResourceLoadingException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ResourceService {

  private static final Logger LOGGER = LogManager.getLogger(ResourceService.class);

  @Qualifier("webApplicationContext")
  @Autowired
  private ResourceLoader resourceLoader;

  /**
   * Allows loading files from resources folder
   *
   * @param filename filename relatively to resources
   * @return file content as {@link String}
   * @throws ResourceLoadingException when the file was not found or could not be loaded
   */
  public String getResourceAsString(final String filename) throws ResourceLoadingException {
    try {
      final Resource resource = resourceLoader.getResource("classpath:" + filename);
      final InputStream inputStream = resource.getInputStream();
      return new BufferedReader(new InputStreamReader(inputStream))
          .lines()
          .collect(Collectors.joining("\n"));
    } catch (final IOException cause) {
      LOGGER.error("Could not read file {}", filename, cause);
      throw new ResourceLoadingException(filename, cause);
    }
  }

  /**
   * Allows loading files from resources folder
   *
   * @param filename filename relatively to resources
   * @return file resource as {@link File}
   * @throws ResourceLoadingException when the file was not found or could not be loaded
   */
  public File getResourceAsFile(final String filename) throws ResourceLoadingException {
    try {
      final Resource resource = resourceLoader.getResource("classpath:" + filename);
      final InputStream inputStream = resource.getInputStream();

      byte[] buffer = new byte[inputStream.available()];
      int result = inputStream.read(buffer);
      if (result == -1) {
        LOGGER.error("Error reading file {}, result: {}", filename, result);
        throw new ResourceLoadingException(filename);
      }

      final File targetFile = new File(filename);
      final OutputStream outStream = new FileOutputStream(targetFile);
      outStream.write(buffer);

      return targetFile;
    } catch (final IOException cause) {
      LOGGER.error("Could not read file {}", filename, cause);
      throw new ResourceLoadingException(filename, cause);
    }
  }

  /**
   * Replace all occurences of ${KEY} in template with the values in params map.
   *
   * @param template given String
   * @param params map pf key - value pairs
   * @return new String with replaced keys
   */
  public String replacePlaceholder(final String template, final Map<String, String> params) {
    String result = template;
    for (Map.Entry<String, String> entry : params.entrySet()) {
      result = result.replaceAll("\\$\\{" + entry.getKey() + "}", entry.getValue());
    }
    return result;
  }
}
