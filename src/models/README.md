# Models

This is a layer which contains models for data coming from TW.

The models have a constructor which accept the raw protobuf data (based on the
[Protobuf definitions](http://shortn/twproto)) and each model has several
methods which allow access to the data in a friendly way.

Given that we have refactored to the new DI architecture, data should be
handled in generic entities that are independent of the outside world. Thus,
this layer (and the ways of building these models) should NOT be used anymore.

Instead, entities should be created in the `domain` folder and factories should
be created in order to convert raw protobuf data to an entity and viceversa.
