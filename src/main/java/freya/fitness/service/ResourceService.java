package freya.fitness.service;

import freya.fitness.utils.ResourceLoadingException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Component
public class ResourceService {

  private static final Logger LOGGER = LogManager.getLogger(ResourceService.class);

  @Qualifier("webApplicationContext")
  @Autowired
  private ResourceLoader resourceLoader;

  public String getResourceAsString(final String filename) throws ResourceLoadingException {
    try {
      final Resource resource = resourceLoader.getResource("classpath:" + filename);
      long length = resource.getFile().length();
      final InputStream in = resource.getInputStream();
      byte[] bytes = new byte[(int) length];
      int result = in.read(bytes);
      if (-1 == result) {
        throw new ResourceLoadingException(filename);
      }
      return new String(bytes);
    } catch (final IOException cause) {
      LOGGER.error("Could not read file {}", filename, cause);
      throw new ResourceLoadingException(filename, cause);
    }
  }


  public File getResourceAsFile(final String filename) throws ResourceLoadingException {
    try {
      return resourceLoader.getResource("classpath:" + filename).getFile();
    } catch (final IOException cause) {
      LOGGER.error("Could not read file {}", filename, cause);
      throw new ResourceLoadingException(filename, cause);
    }
  }
}
