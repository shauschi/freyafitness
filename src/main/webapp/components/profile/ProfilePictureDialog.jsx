'use strict';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AvatarEditor from 'react-avatar-editor';
import {setPath} from '../../utils/RamdaUtils';
import {IconRotateLeft, IconRotateRight, IconZoomIn, IconZoomOut} from '../../utils/Icons';
import {Dialog, LoadingIndicator} from './../general';
import Hammer from 'react-hammerjs';

let options = {
  recognizers: {
    pinch: { enable: true }
  }
};

class ProfilePictureDialog extends Component {

  state = {
    rotate: 0,
    zoom: 1.5,
    acceptAGB: false
  };

  constructor(props) {
    super(props);
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

    // Upload the original image, transformation is done on the server to all required sizes
    const canvas = this.editor.getImage();
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('image', blob, file.name);
      this.props.onSave(formData);
    });
  };

  handleRequestClose = () => {
    this.props.onClose();
    this.resetState();
  };

  setAvatarEditorRef = (editor) => {
    this.editor = editor;
  };

  resetState = () => {
    this.setState({acceptAGB: false, rotate: 0, errorText: undefined});
  };

  rotateLeft = () => {
    this.setState(setPath(['rotate'], this.state.rotate - 90, this.state));
  };

  rotateRight = () => {
    this.setState(setPath(['rotate'], this.state.rotate + 90, this.state));
  };

  zoomIn = () => {
    this.setState(setPath(['zoom'], this.state.zoom + 0.1, this.state));
  };

  zoomOut = () => {
    this.setState(setPath(['zoom'], this.state.zoom - 0.1, this.state));
  };

  onCheckboxChange = event => {
    this.setState({acceptAGB: event.target.checked, errorText: undefined});
  };

  getInput = () => {
    return <input
      type={'file'}
      accept={'image/*'}
      name={'image'}
      style={{position: 'absolute', width: '100%', height: '100%', top: '0', left: '0', opacity: '0'}}
      onChange={this.handleUpload}
    />;
  };

  render() {
    const {acceptAGB, rotate, zoom, errorText} = this.state;
    const {show, temp, pending} = this.props;

    return (
      <Dialog
        title='Profilbild ändern'
        onClose={this.handleRequestClose}
        open={show}>
        <DialogContent style={{padding: '0px'}}>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} sm={10} md={8} style={{position: 'relative', padding: '0px'}}>
              <Hammer options={options} onPinchIn={this.zoomIn} onPinchOut={this.zoomOut}>
                <div>
                  <AvatarEditor
                    ref={this.setAvatarEditorRef}
                    image={temp.dataUrl}
                    width={300}
                    height={300}
                    border={[150, 75]}
                    color={[100, 100, 100, 0.75]}
                    scale={zoom}
                    rotate={rotate}
                    style={{width: '100%', height: '100%'}}
                  />
                </div>
              </Hammer>
              {
                temp.dataUrl
                  ? undefined
                  : this.getInput()
              }
              <div style={{
                position: 'absolute',
                width: '100%',
                bottom: '0px',
                padding: '16px auto',
                textAlign: 'center'
              }}>
                <Button variant='flat' style={{color: 'white'}}>
                  {this.getInput()}
                  Bild wählen
                </Button>
                <IconButton onClick={this.zoomIn} style={{color: 'white'}}>
                  <IconZoomIn/>
                </IconButton>
                <IconButton onClick={this.zoomOut} style={{color: 'white'}}>
                  <IconZoomOut/>
                </IconButton>
                <IconButton onClick={this.rotateRight} style={{color: 'white'}}>
                  <IconRotateRight/>
                </IconButton>
                <IconButton onClick={this.rotateLeft} style={{color: 'white'}}>
                  <IconRotateLeft/>
                </IconButton>
              </div>
            </Grid>

            <Grid item xs={12} style={{padding: '24px', width: '100%'}}>
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
            </Grid>
          </Grid>
        </DialogContent>
        {
          pending
            ? <div style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.75)'}}>
                <LoadingIndicator label='speichern...'/>
              </div>
            : undefined
        }

        <DialogActions>
          <Button onClick={this.handleRequestSave} color="primary" disabled={pending}>Speichern</Button>
          <Button onClick={this.handleRequestClose} disabled={pending}>Abbrechen</Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default ProfilePictureDialog;