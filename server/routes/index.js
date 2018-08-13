import { Router } from 'express';
import account from './account';
import bucketlists from './bucketlists';
import posts from './posts';
import articles from './articles';

const router = Router();

router.use('/account', account);
router.use('/bucketlists', bucketlists);
router.use('/posts', posts);
router.use('/articles', articles);

export default router;
