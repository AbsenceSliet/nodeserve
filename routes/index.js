'use strict';

import admin from './admin'
import article from './article'
import category from './category'


export default app => {
    app.use('/api/user', admin)
    app.use('/api/article', article)
    app.use('/api/category', category)
}