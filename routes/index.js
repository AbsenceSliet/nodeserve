'use strict';

import admin from './admin'


export default app => {
    app.use('/api/user', admin)
}