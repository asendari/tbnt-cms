'use strict';

import React from 'react';

import Upload from 'lib/js/components/base/Input/Upload';

import SVGClose from '../../svg/close';
import SVGUpload from '../../svg/upload';

import Styles from '../../../helpers/styles';

const UploadInputBaseComponent = (props) => {
    return (
        <Upload
            {...props}
            previewText={true}
            renderUpload={(text) => (
                <div className="upload-input">
                    <div className="upload-placeholder">
                        <span>{text}</span>
                    </div>
                    <div className="upload-icon">
                        <SVGUpload color={Styles.get('secondary')} />
                    </div>
                </div>
            )}
            renderRemove={() => (
                <div className="upload-remove">
                    <SVGClose color={Styles.get('secondary')} />
                </div>
            )}
            renderCurrentFile={(name) => (
                <div className="upload-file">
                    <span>{name}</span>
                </div>
            )}
        />
    );
};

export default React.memo(UploadInputBaseComponent);
