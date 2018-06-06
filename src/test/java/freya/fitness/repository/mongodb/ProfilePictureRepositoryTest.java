package freya.fitness.repository.mongodb;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import static freya.fitness.TestUtils.TEST_FILE_BYTES;
import static freya.fitness.TestUtils.gridFSFile;
import static freya.fitness.TestUtils.gridFsResource;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProfilePictureRepositoryTest {

  private final String ANY_VALID_OBJECT_ID = "000011110000111100001111";

  @InjectMocks
  private ProfilePictureRepository testee;

  @Mock
  private GridFsTemplate gridFsTemplate;

  @Test
  public void test_getById_returnsNullIfIdIsNull() throws IOException {
    byte[] result = testee.getById(null);

    assertThat(result, nullValue());
    verify(gridFsTemplate, never()).findOne(any());
    verify(gridFsTemplate, never()).getResource(any());
  }

  @Test
  public void test_getById_noPictureFoundForId() throws IOException {
    when(gridFsTemplate.findOne(any())).thenReturn(null);

    byte[] result = testee.getById(ANY_VALID_OBJECT_ID);

    assertThat(result, nullValue());
    verify(gridFsTemplate).findOne(any());
    verify(gridFsTemplate, never()).getResource(any());
  }

  @Test
  public void test_getById_returnFromResource() throws IOException {
    final String location = "test.file";
    final GridFSFile file = gridFSFile(location);
    final GridFsResource gridFsResource = gridFsResource(file);
    when(gridFsTemplate.findOne(any())).thenReturn(file);
    when(gridFsTemplate.getResource(location)).thenReturn(gridFsResource);

    byte[] result = testee.getById(ANY_VALID_OBJECT_ID);

    assertThat(result, notNullValue());
    for (int i = 0; i < result.length; i++) {
      byte b = result[i];
      // Die ersten Bytes entsprechen der Testdatei. Alle weiteren werden mit 0 gefüllt
      if (i < TEST_FILE_BYTES.length) {
        assertThat(b, equalTo(TEST_FILE_BYTES[i]));
      } else {
        assertThat(b, equalTo((byte) 0));
      }
    }

    verify(gridFsTemplate).findOne(any());
    verify(gridFsTemplate).getResource(location);
  }

  @Test(expected = IllegalArgumentException.class)
  public void test_save_throwsExceptionOnNullInput() throws IOException {
    testee.save(null);
  }

  @Test()
  public void test_save_returnsTheObjectIdOfTheSavedFile() throws IOException {
    final MultipartFile multipartFile =
        new MockMultipartFile("test.file", "filename",
            "image/*", new byte[]{1, 0});
    when(gridFsTemplate.store(any(), anyString()))
        .thenReturn(new ObjectId(ANY_VALID_OBJECT_ID));

    final String result = testee.save(multipartFile);

    assertThat(result, equalTo(ANY_VALID_OBJECT_ID));
    verify(gridFsTemplate).store(any(ByteArrayInputStream.class), eq("filename"));
  }

  @Test
  public void test_delete_doesNotUseGridFsTemplateIfIdIsNull() {
    testee.delete(null);

    verify(gridFsTemplate, never()).delete(any());
  }

  @Test
  public void test_delete_callsGridFsTemplateDelete() {
    testee.delete(ANY_VALID_OBJECT_ID);

    verify(gridFsTemplate).delete(any());
  }
}