'use strict';

import PostHelperParent from 'lib/js/helpers/post';

import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';

import makeUrl from 'lib/js/utils/makeUrl';
import toArray from 'lib/js/utils/toArray';

import LangConfig from '../config/lang';

class PostHelper extends PostHelperParent {
    getUrl(append = []) {
        return makeUrl(
            [
                this.getCanonical()?.[LangConfig.get('current')?.code] ??
                    this.getCanonical()?.[LangConfig.get('default_code')] ??
                    '',
            ].concat(toArray(append)),
            true,
        );
    }

    static find(posts, key, value, autoInit = true) {
        const post = find(posts, (post) => value === (post.get?.(key) ?? get(post, key))) ?? null;

        return post !== null && autoInit === true ? PostHelper.init(post) : post;
    }

    static findSlug(posts, slug, autoInit = true) {
        return PostHelper.find(posts, 'lang.url', slug, autoInit);
    }

    // static findSlugWithSources(sourcesArrays, slug, autoInit = true) {
    //     return PostHelper.findSlug(
    //         filter(sourcesArrays.reduce((result, value) => result.concat(toArray(value)), [])),
    //         slug,
    //         autoInit,
    //     );
    // }

    static init(post) {
        return PostHelperParent.init(post, PostHelper);
    }
}

export default PostHelper;
