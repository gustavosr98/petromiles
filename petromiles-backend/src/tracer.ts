import tracer from 'dd-trace';

tracer.init({
  analytics: true,
});

export default tracer;
