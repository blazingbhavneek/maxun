import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Highlight from 'react-highlight';
import { useCallback, useEffect, useRef, useState } from "react";
import { useSocketStore } from "../../context/socket";
import { useBrowserDimensionsStore } from "../../context/browserDimensions";
import { useActionContext } from '../../context/browserActions';

export const InterpretationLog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [log, setLog] = useState<string>('');

  const logEndRef = useRef<HTMLDivElement | null>(null);

  const { width } = useBrowserDimensionsStore();
  const { getList } = useActionContext();

  const toggleDrawer = (newOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setOpen(newOpen);
  };

  const { socket } = useSocketStore();

  const scrollLogToBottom = () => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLog = useCallback((msg: string, date: boolean = true) => {
    if (!date) {
      setLog((prevState) => prevState + '\n' + msg);
    } else {
      setLog((prevState) => prevState + '\n' + `[${new Date().toLocaleString()}] ` + msg);
    }
    scrollLogToBottom();
  }, [log, scrollLogToBottom]);

  const handleSerializableCallback = useCallback((data: string) => {
    setLog((prevState) =>
      prevState + '\n' + '---------- Serializable output data received ----------' + '\n'
      + JSON.stringify(data, null, 2) + '\n' + '--------------------------------------------------');
    scrollLogToBottom();
  }, [log, scrollLogToBottom]);

  const handleBinaryCallback = useCallback(({ data, mimetype }: any) => {
    setLog((prevState) =>
      prevState + '\n' + '---------- Binary output data received ----------' + '\n'
      + `mimetype: ${mimetype}` + '\n' + `data: ${JSON.stringify(data)}` + '\n'
      + '------------------------------------------------');
    scrollLogToBottom();
  }, [log, scrollLogToBottom]);

  useEffect(() => {
    socket?.on('log', handleLog);
    socket?.on('serializableCallback', handleSerializableCallback);
    socket?.on('binaryCallback', handleBinaryCallback);
    return () => {
      socket?.off('log', handleLog);
      socket?.off('serializableCallback', handleSerializableCallback);
      socket?.off('binaryCallback', handleBinaryCallback);
    };
  }, [socket, handleLog]);

  return (
    <div>
      <button
        onClick={toggleDrawer(true)}
        style={{
          color: 'white',
          background: '#3f4853',
          border: 'none',
          padding: '10px 20px',
          width: 1280,
          textAlign: 'left'
        }}>
        Interpretation Log
      </button>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: { background: '#19171c', color: 'white', padding: '10px', height: 720, width: width - 10, display: 'flex' }
        }}
      >
        <Typography variant="h6" gutterBottom>
          Interpretation Log
        </Typography>
        <div style={{
          height: '50vh',
          overflowY: 'scroll',
          padding: '10px',
          background: '#19171c',
        }}>
          <Highlight className="javascript">
            {log}
          </Highlight>
          {
            getList ? (
              <>
                <p>What is the maximum number of rows you want to extract?</p>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                    <FormControlLabel
                      value="disabled"
                      disabled
                      control={<Radio />}
                      label="other"
                    />
                  </RadioGroup>
                </FormControl>
              </>
            ) : null
          }
          <div style={{ float: "left", clear: "both" }}
            ref={logEndRef} />
        </div>
      </SwipeableDrawer>
    </div>
  );
}
