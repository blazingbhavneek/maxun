import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { PaginationType, useActionContext, LimitType } from '../../context/browserActions';

const CustomBoxContainer = styled.div`
  position: relative;
  width: 300px; /* Adjust width as needed */
  height: 200px; /* Adjust height as needed */
  border: 2px solid #ff00c3;
  background-color: white;
  margin: 30px auto;
`;

const Triangle = styled.div`
  position: absolute;
  top: -20px; /* Adjust this value to control the height of the triangle */
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 20px solid #ff00c3;
`;

const Content = styled.div`
  padding: 20px;
  text-align: center;
`;

const ActionDescriptionBox = () => {
  const { getText, startGetText, stopGetText, getScreenshot, startGetScreenshot, stopGetScreenshot, getList, startGetList, stopGetList, startPaginationMode, stopPaginationMode, paginationType, updatePaginationType, limitType, customLimit, updateLimitType, updateCustomLimit, stopLimitMode, startLimitMode } = useActionContext();

  const renderActionDescription = () => {
    if (getText) {
      return <p>Getting text...</p>;
    } else if (getScreenshot) {
      return <p>Getting screenshot...</p>;
    } else if (getList) {
      return <p>Getting list...</p>;
    } else {
      return (
        <div>
          <p>Defauly</p>
        </div>
      );
    }
  }

    return (
        <CustomBoxContainer>
            <Triangle />
            <Content>
                {renderActionDescription()}
            </Content>
        </CustomBoxContainer>
    );
};

export default ActionDescriptionBox;
