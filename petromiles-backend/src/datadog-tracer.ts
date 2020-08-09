import tracer from 'dd-trace';

tracer.init({
  analytics: true,
  profiling: true,
  env: process.env.RUNNING_ENVIROMENT,
});

export default tracer;
