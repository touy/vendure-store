import { GetRunningJobs, JobState } from '../graphql/generated-e2e-admin-types';
import { GET_RUNNING_JOBS } from '../graphql/shared-definitions';
import { TestAdminClient } from '../test-client';

/**
 * For mutation which trigger background jobs, this can be used to "pause" the execution of
 * the test until those jobs have completed;
 */
export async function awaitRunningJobs(adminClient: TestAdminClient, timeout: number = 5000) {
    let runningJobs = 0;
    const startTime = +new Date();
    let timedOut = false;
    // Allow a brief period for the jobs to start in the case that
    // e.g. event debouncing is used before triggering the job.
    await new Promise(resolve => setTimeout(resolve, 100));
    do {
        const { jobs } = await adminClient.query<GetRunningJobs.Query>(GET_RUNNING_JOBS);
        runningJobs = jobs.filter(job => job.state !== JobState.COMPLETED).length;
        timedOut = timeout < +new Date() - startTime;
    } while (runningJobs > 0 && !timedOut);
}
