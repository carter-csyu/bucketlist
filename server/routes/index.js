import { Router } from 'express';
import account from './account';
import bucketlist from './bucketlist';
import post from './post';

const router = Router();

router.use('/account', account);
router.use('/bucketlist', bucketlist);
router.use('/post', post);

export default router;
