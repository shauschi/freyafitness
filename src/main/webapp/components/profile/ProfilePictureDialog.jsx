'use strict';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import AvatarEditor from 'react-avatar-editor';
import Slide from '@material-ui/core/Slide';
import {setPath} from '../../utils/RamdaUtils';

import {IconClose} from '../../utils/Icons';
import {blueGrey} from '@material-ui/core/colors';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ProfilePictureDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {acceptAGB: false};
    this.handleUpload = this.handleUpload.bind(this);
    this.handleRequestSave = this.handleRequestSave.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.setAvatarEditorRef = this.setAvatarEditorRef.bind(this);
  }

  handleUpload(e) {
    const {changeTempProfilePicture} = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = (e) => {
      const temp = {
        file: file,
        dataUrl: e.target.result
      };
      changeTempProfilePicture(temp);
    };
    this.setState(setPath(['errorText'], undefined, this.state));
    reader.readAsDataURL(file);
  }

  handleRequestSave = () => {
    const {file} = this.props.temp;
    if (!file) {
      this.setState(setPath(['errorText'], 'Bitte ein neues Bild auswählen', this.state));
      return;
    }
    const {acceptAGB} = this.state;
    if (!acceptAGB) {
      this.setState(setPath(['errorText'], 'Bitte die AGB akzeptieren', this.state));
      return;
    }

    const canvasScaled = this.editor.getImageScaledToCanvas();
    canvasScaled.toBlob(blob => {
      const formData = new FormData();
      formData.append('image', blob, file.name);
      this.resetState();
      this.props.onSave(formData);
    });
  };

  handleRequestClose = () => {
    this.resetState();
    this.props.onClose();
  };

  setAvatarEditorRef = (editor) => {
    this.editor = editor;
  };

  resetState = () => {
    this.setState({acceptAGB: false, errorText: undefined});
  };

  onCheckboxChange = event => {
    this.setState({acceptAGB: event.target.checked, errorText: undefined});
  };

  render() {
    const {acceptAGB, errorText} = this.state;
    const {show, fullScreen, temp} = this.props;

    return (
      <Dialog
        onClose={this.handleRequestClose}
        fullScreen={fullScreen}
        transition={Transition}
        open={show}>

          <DialogTitle disableTypography
                       style={{color: 'white', background: blueGrey[800], display: 'flex', padding: '2px 16px'}}>
            <IconButton style={{color: 'white'}} onClick={this.handleRequestClose} aria-label="Close">
              <IconClose/>
            </IconButton>
            <Typography type="title" style={{color: 'white', flex: 1, textAlign: 'center', padding: '14px 0'}}>
              Profilbild anpassen
            </Typography>
          </DialogTitle>

          <DialogContent>
            <div style={{margin: '24px auto', width: '250px', height: '250px'}}>
              <AvatarEditor
                ref={this.setAvatarEditorRef}
                image={temp.dataUrl}
                width={200}
                height={200}
                border={25}
                color={[200, 200, 200, 0.75]}
                scale={1.5}
                rotate={0}
              />
            </div>
            <div style={{margin: '16px auto', textAlign: 'center'}}>
              <Button variant='raised' color='primary'>
                <input
                  type={'file'}
                  accept={'image/*'}
                  name={'image'}
                  style={{position: 'absolute', width: '100%', opacity: '0'}}
                  onChange={this.handleUpload}
                />
                Ein anderes Bild wählen
              </Button>
            </div>
            {/* TODO nach Login with Facebook
            <div style={{margin: '16px auto', textAlign: 'center'}}>
              <Button raised>Mein facebook Profilbild nehmen</Button>
            </div>
            */}
            <div>
              <Typography>Wähle einen Bildausschnitt für Dein neues Profilbild
                und klicke anschließend auf Speichern.
                Mit dem Speichern bestätigst Du, dass Du die Rechte an diesem Bild besitzt
                und es nicht gegen unsere AGB verstößt.
              </Typography>
              <FormControl required error={!!errorText}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id='acceptAGB'
                      checked={acceptAGB}
                      onChange={this.onCheckboxChange}
                    />
                  }
                  label={'ich stimme zu'}
                />
                <FormHelperText>{errorText}</FormHelperText>
              </FormControl>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleRequestSave} color="primary">Speichern</Button>
            <Button onClick={this.handleRequestClose} color="primary">Abbrechen</Button>
          </DialogActions>
      </Dialog>
    );
  };
}

export default withMobileDialog()(ProfilePictureDialog);